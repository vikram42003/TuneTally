# Lambda Layer (for requests package)
data "archive_file" "requests_layer_zip" {
  type = "zip"
  source_dir = "${path.module}/python/lambda_layer_source"
  output_path = "${path.module}/dist/lambda_layer_payload.zip"
}

resource "aws_lambda_layer_version" "requests_layer" {
  layer_name = "requests-library"
  filename = data.archive_file.requests_layer_zip.output_path
  source_code_hash = data.archive_file.requests_layer_zip.output_base64sha256
  compatible_runtimes = ["python3.10"]
}

# Authorization Lambda
data "archive_file" "auth_lambda" {
  type        = "zip"
  source_file = "${path.module}/python/authorizationLambda.py"
  output_path = "${path.module}/dist/authorization_lambda_function_payload.zip"
}

resource "aws_lambda_function" "TuneTally_Authorization_Lambda" {
  filename         = data.archive_file.auth_lambda.output_path
  function_name    = "TuneTally_Authorization_Lambda"
  role             = aws_iam_role.auth_lambda_role.arn
  handler          = "authorizationLambda.lambda_handler"
  timeout = 5

  source_code_hash = data.archive_file.auth_lambda.output_base64sha256

  runtime = "python3.10"

  layers = [aws_lambda_layer_version.requests_layer.arn]

  environment {
    variables = {
      SPOTIFY_CLIENT_ID = var.SPOTIFY_CLIENT_ID
      SPOTIFY_CLIENT_SECRET = var.SPOTIFY_CLIENT_SECRET
      SPOTIFY_REDIRECT_URI = var.SPOTIFY_REDIRECT_URI
      TUNETALLY_BASE_URL = var.TUNETALLY_BASE_URL
    }
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

# Request Proxy Lambda
data "archive_file" "proxy_lambda" {
  type        = "zip"
  source_file = "${path.module}/python/requestProxyLambda.py"
  output_path = "${path.module}/dist/request_proxy_lambda_function_payload.zip"
}

resource "aws_lambda_function" "TuneTally_Request_Proxy_Lambda" {
  filename         = data.archive_file.proxy_lambda.output_path
  function_name    = "TuneTally_Request_Proxy_Lambda"
  role             = aws_iam_role.proxy_lambda_role.arn
  handler          = "requestProxyLambda.lambda_handler"
  timeout = 10

  source_code_hash = data.archive_file.proxy_lambda.output_base64sha256

  runtime = "python3.10"

  layers = [aws_lambda_layer_version.requests_layer.arn]

  environment {
    variables = {
      TUNETALLY_BASE_URL = var.TUNETALLY_BASE_URL
    }
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}