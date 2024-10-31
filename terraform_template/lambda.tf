resource "aws_lambda_function" "CUPS_CODES_UPLOAD" {
  filename         = "files/cups_codes.zip"
  function_name    = "MEDICAL_CUPS_CODES"
  timeout          = 400
  role             = aws_iam_role.iam_role_lambda.arn
  handler          = "handler.handler"
  source_code_hash = data.archive_file.cups_codes_file.output_base64sha256
  runtime          = "nodejs16.x"
}

# resource "aws_lambda_permission" "cups_codes_permission" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.CUPS_CODES_UPLOAD.function_name
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_api_gateway_deployment.api_gateway_deployment.execution_arn}*"
# }