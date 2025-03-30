import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Toast as BsToast } from "bootstrap";
import { useDispatch } from "react-redux";
import { removeMessage } from "../redux/toastSlice";

const TOAST_DURATION = 2000;

export default function Toast() {

    const messages = useSelector((state) => state.toast.messages);
    const toastRefs = useRef({});
    const dispatch = useDispatch();

    useEffect(() => {
        messages.forEach((message) => {
            const messageElement = toastRefs.current[message.id];
            if (messageElement) {
                const toastInstance = new BsToast(messageElement);
                toastInstance.show();

                setTimeout(() => {
                    dispatch(removeMessage(message.id));
                }, TOAST_DURATION);
            }
        });
    }, [messages, dispatch]);

    const handleDismiss = (message_id) => {
        dispatch(removeMessage(message_id));
    };

    return (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1000 }}>
            {messages.map((message) => (
                <div
                    className="toast"
                    key={message.id}
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    ref={(el) => (toastRefs.current[message.id] = el)}
                >
                    <div className={`toast-header ${message.status === 'success' ? 'bg-success' : 'bg-danger'} text-white`}>
                        <strong className="me-auto">{message.status === 'success' ? '成功' : '失敗'}</strong>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => handleDismiss(message.id)}
                        ></button>
                    </div>
                    <div className="toast-body">{message.text}</div>
                </div>
            ))}
        </div>
    );
}