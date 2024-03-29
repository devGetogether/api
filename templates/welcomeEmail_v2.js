const Email = () => {
	return (
		<div>
			<table
				width="100%"
				border="0"
				cellspacing="0"
				cellpadding="0">
				<tr>
					<td align="center">
						<table
							width="600"
							border="0"
							cellspacing="0"
							cellpadding="0">
							<tr>
								<td
									align="center"
									bgcolor="#f9f9f9"
									style="padding: 40px;">
									<h1>Welcome to Our Service!</h1>
									<p>Dear [Name],</p>
									<p>
										Thank you for subscribing to our service! We are excited to
										have you on board and we're confident that you'll find our
										service to be valuable.
									</p>
									<p>
										To get started, you can access your account by logging in to{' '}
										<a href="[insert login link here]">
											[insert login link here]
										</a>
										.
									</p>
									<p>
										Here you will find all the features and resources that are
										available to you as a subscriber.
									</p>
									<p>
										If you have any questions or need assistance, please don't
										hesitate to reach out to our support team by emailing{' '}
										<a href="mailto:[insert support email here]">
											[insert support email here]
										</a>{' '}
										or by visiting our{' '}
										<a href="[insert support page link here]">
											[insert support page link here]
										</a>
										.
									</p>
									<p>
										Thank you again for choosing our service. We look forward to
										helping you achieve your goals.
									</p>
									<p>Best regards,</p>
									<p>[Your Name]</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	);
};

export default Email;
