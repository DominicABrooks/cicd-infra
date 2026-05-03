terraform {
  required_version = ">= 1.0"
}

resource "null_resource" "deploy" {
  provisioner "local-exec" {
    command = "echo Deploy triggered"
  }
}