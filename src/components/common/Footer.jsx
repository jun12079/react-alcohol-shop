export default function Footer() {
	return (
		<>
			<div className="bg-dark py-1">
				<div className="container">
					<div className="d-flex align-items-center justify-content-between text-white">
						<a href="/">
							<img
								className="footer-logo-href"
								src="./images/logo.png"
								alt="logo"
							/>
						</a>
						<div className="">
							<ul className="d-flex list-unstyled mb-1 h4">
								<li>
									<a href="#" className="text-white mx-3">
										<i className="fs-2 bi bi-facebook" />
									</a>
								</li>
								<li>
									<a href="#" className="text-white mx-3">
										<i className="fs-2 bi bi-instagram" />
									</a>
								</li>
								<li>
									<a href="#" className="text-white ms-3">
										<i className="fs-2 bi bi-envelope" />
									</a>
								</li>
							</ul>
							<div className="mb-md-0 mb-1">
								Phone :{" "}
								<a className="text-white" href="tel:(02) 3456-7890">
									(02) 3456-7890
								</a>
								<br />
								E-mail :{" "}
								<a className="text-white" href="mailto:wine12079@mail.com">
									wine12079@mail.com
								</a>
							</div>
						</div>
					</div>
					<div className="d-flex flex-column flex-md-row justify-content-center align-items-md-end align-items-center text-white my-2">
						<p className="mb-0">© 2025 LOGO All Rights Reserved.</p>
					</div>
				</div>
			</div>
		</>
	);
}