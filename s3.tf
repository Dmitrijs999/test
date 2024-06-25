resource "aws_s3_bucket" "default" {
  bucket        = "${var.organisation}-${var.application}-testnet"
  force_destroy = true
}
