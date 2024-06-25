resource "aws_cloudfront_origin_access_identity" "default" {}

data "aws_iam_policy_document" "default" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.default.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.default.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "default" {
  bucket = aws_s3_bucket.default.id
  policy = data.aws_iam_policy_document.default.json
}


data "aws_iam_policy_document" "locales" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${var.locales_s3_bucket.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.default.iam_arn]
    }
  }
}

resource "aws_s3_bucket_policy" "locales" {
  bucket = var.locales_s3_bucket.id
  policy = data.aws_iam_policy_document.locales.json
}
