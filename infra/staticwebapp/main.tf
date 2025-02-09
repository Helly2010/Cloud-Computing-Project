resource "azurerm_resource_group" "web_app_rg" {
  name     = "lowtechgmbh-webapp-rg"
  location = "West Europe"
}




resource "azurerm_static_web_app" "frontend" {
  name                = "lowtechgmbh-webshop"
  resource_group_name = azurerm_resource_group.web_app_rg.name
  location            = azurerm_resource_group.web_app_rg.location
  repository_branch   = "main"
  repository_url      = "https://github.com/Wason1797/Cloud-Computing-Project"
  repository_token    = "*"
}
