resource "aws_s3_bucket" "default" {
  bucket        = "${var.organisation}-${var.application}-mainnet"
  force_destroy = true
}
