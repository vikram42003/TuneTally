resource "aws_lambda_permission" "Allow_TuneTally_Authorizarion_Lambda" {
  statement_id  = "Allow_TuneTally_API_Gateway_Invoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Authorization_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/GET/spotifyLogin"
}

resource "aws_lambda_permission" "Allow_TuneTally_Callback_Lambda" {
  statement_id  = "Allow_TuneTally_API_Gateway_Invoke_Callback"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Authorization_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/GET/spotifyLoginCallback"
}

resource "aws_lambda_permission" "Allow_TuneTally_Request_Proxy_Lambda_GET" {
  statement_id  = "Allow_TuneTally_Request_Proxy_Lambda_GET"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Request_Proxy_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/GET/spotify/*"
}

resource "aws_lambda_permission" "Allow_TuneTally_Request_Proxy_Lambda_POST" {
  statement_id  = "Allow_TuneTally_Request_Proxy_Lambda_POST"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.TuneTally_Request_Proxy_Lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.TuneTally_API_Gateway.execution_arn}/*/POST/spotify/*"
}

resource "aws_api_gateway_rest_api" "TuneTally_API_Gateway" {
  name = "TuneTally_API_Gateway"

  body = jsonencode({
    openapi = "3.0.1"
    info = {
      title   = "TuneTally_API_Gateway"
      version = "1.0"
    }
    paths = {
      "/spotifyLogin" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Authorization_Lambda.invoke_arn
          }
        }
        options = {
          responses = {
            "200" = {
              description = "Default response for CORS method"
              headers = {
                Access-Control-Allow-Headers = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Origin = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Methods = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Credentials = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            type             = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Origin"  = "'${var.TUNETALLY_BASE_URL}'"
                  "method.response.header.Access-Control-Allow-Credentials"  = "'true'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
        }
      }
      "/spotifyLoginCallback" = {
        get = {
          responses = {
            "302" = {
              description = "Callback response that sets the cookie and redirects."
              headers = {
                "Set-Cookie" = {
                  schema = {
                    type = "string"
                  }
                }
                "Location" = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Authorization_Lambda.invoke_arn
          }
        }
        options = {
          responses = {
            "200" = {
              description = "Default response for CORS method"
              headers = {
                Access-Control-Allow-Headers = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Origin = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Methods = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Credentials = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            type             = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Origin"  = "'${var.TUNETALLY_BASE_URL}'"
                  "method.response.header.Access-Control-Allow-Credentials"  = "'true'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
        }
      }
      "/spotify/{proxy+}" = {
        get = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Request_Proxy_Lambda.invoke_arn
          }
        }
        post = {
          x-amazon-apigateway-integration = {
            httpMethod           = "POST"
            payloadFormatVersion = "1.0"
            type                 = "AWS_PROXY"
            uri                  = aws_lambda_function.TuneTally_Request_Proxy_Lambda.invoke_arn
          }
        }
        options = {
          responses = {
            "200" = {
              description = "Default response for CORS method"
              headers = {
                Access-Control-Allow-Headers = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Origin = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Methods = {
                  schema = {
                    type = "string"
                  }
                }
                Access-Control-Allow-Credentials = {
                  schema = {
                    type = "string"
                  }
                }
              }
            }
          }
          x-amazon-apigateway-integration = {
            type             = "mock"
            requestTemplates = {
              "application/json" = "{\"statusCode\": 200}"
            }
            responses = {
              default = {
                statusCode = "200"
                responseParameters = {
                  "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,Authorization'"
                  "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,OPTIONS'"
                  "method.response.header.Access-Control-Allow-Origin"  = "'${var.TUNETALLY_BASE_URL}'"
                  "method.response.header.Access-Control-Allow-Credentials"  = "'true'"
                }
                responseTemplates = {
                  "application/json" = ""
                }
              }
            }
          }
        }
      }
    }
  })

  endpoint_configuration {
    types = ["REGIONAL"]
  }

  tags = {
    Project     = "TuneTally_Terraform"
    Environment = "Production"
  }
}

resource "aws_api_gateway_deployment" "TuneTally_API_Gateway_Deployment" {
  rest_api_id = aws_api_gateway_rest_api.TuneTally_API_Gateway.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.TuneTally_API_Gateway.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "example" {
  deployment_id = aws_api_gateway_deployment.TuneTally_API_Gateway_Deployment.id
  rest_api_id   = aws_api_gateway_rest_api.TuneTally_API_Gateway.id
  stage_name    = "v1"
}