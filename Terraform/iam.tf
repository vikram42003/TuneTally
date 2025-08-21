data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Authorization Lambda function

resource "aws_iam_role" "auth_lambda_role" {
  name               = "auth_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

# For the auth function, it needs (almost) full access to the dynamoDB table
resource "aws_iam_policy" "auth_lambda_dynamodb_access" {
  name = "auth_lambda_dynamodb_access"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ],
        Resource = aws_dynamodb_table.sessionID_token_pair.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_policy_to_auth_lambda" {
  role       = aws_iam_role.auth_lambda_role.name
  policy_arn = aws_iam_policy.auth_lambda_dynamodb_access.arn
}

resource "aws_iam_role_policy_attachment" "attach_lambda_logging_to_auth_lambda" {
  role       = aws_iam_role.auth_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Proxy Lambda function
resource "aws_iam_role" "proxy_lambda_role" {
  name               = "proxy_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

# For the request proxy lambda, it only needs to check whether the session is valid or not
resource "aws_iam_policy" "proxy_lambda_dynamodb_access" {
  name = "lambda_dynamodb_only_getItem_access"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:GetItem",
          "dynamodb:UpdateItem"
        ],
        Resource = aws_dynamodb_table.sessionID_token_pair.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_dynamodb_policy_to_proxy_lambda" {
  role       = aws_iam_role.proxy_lambda_role.name
  policy_arn = aws_iam_policy.proxy_lambda_dynamodb_access.arn
}

resource "aws_iam_role_policy_attachment" "attach_lambda_logging_to_proxy_lambda" {
  role       = aws_iam_role.proxy_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}