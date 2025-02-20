variable "location" {

}

variable "rg_name" {

}


variable "subnet_id" {

}

variable "db_url" {
  type      = string
  sensitive = true
}

variable "mail_from" {
  type      = string
  sensitive = true
}

variable "mail_password" {
  type      = string
  sensitive = true
}


variable "mail_port" {
  type      = string
  sensitive = true
}

variable "mail_server" {
  type      = string
  sensitive = true
}

variable "mail_username" {
  type      = string
  sensitive = true
}



variable "scm_do_build_during_deployment" {
  type      = string
  sensitive = true
}
