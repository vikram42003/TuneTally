data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/python/authorizationLambda.py"
  output_path = "authorization_lambda_function_payload.zip"
}

resource "aws_lambda_function" "TuneTally_Authorization_Lambda" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "TuneTally_Authrization_Lambda"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "lambdaFunction.lambda_handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "python3.12"

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}