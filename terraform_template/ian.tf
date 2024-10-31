resource "aws_iam_role" "iam_role_lambda" {
  name = "CUPS_CODES_ROLE"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "dynamodb.amazonaws.com",
          ]
        },
        Action = [
          "sts:AssumeRole"
        ]
      }
    ]
  })
}
resource "aws_iam_policy" "iam_policy_lambda" {
  name = "CUPS_CODE_POLICY"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = [
          "lambda:*",
          "dynamodb:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      }
    ]
  })
}
resource "aws_iam_role_policy_attachment" "policy_attachment" {
  role       = aws_iam_role.iam_role_lambda.name
  policy_arn = aws_iam_policy.iam_policy_lambda.arn
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution_attachment" {
  role       = aws_iam_role.iam_role_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}