terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "=4.18.0"
    }
  }
}

provider "azurerm" {
  features {}

  client_id       = var.TF_AZURE_APP_ID
  client_secret   = var.TF_AZURE_PASSWORD
  tenant_id       = var.TF_AZURE_TENANT
  subscription_id = var.TF_AZURE_SUBSCRIPTION_ID

}

resource "azurerm_resource_group" "main_rg" {
  name     = "lowtechgmbh-project-rg"
  location = "Germany West Central"
}


resource "azurerm_virtual_network" "vn" {
  name                = "lowtechgmbh-vn"
  location            = azurerm_resource_group.main_rg.location
  resource_group_name = azurerm_resource_group.main_rg.name
  address_space       = ["10.0.0.0/16"]
}

resource "azurerm_subnet" "vn_subnet" {
  name                 = "lowtechgmbh-sn"
  resource_group_name  = azurerm_resource_group.main_rg.name
  virtual_network_name = azurerm_virtual_network.vn.name
  address_prefixes     = ["10.0.2.0/24"]
  service_endpoints    = ["Microsoft.Storage"]
  delegation {
    name = "fs"
    service_delegation {
      name = "Microsoft.DBforPostgreSQL/flexibleServers"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/join/action",
      ]
    }
  }
  depends_on = [azurerm_virtual_network.vn]
}


resource "azurerm_subnet" "vn_subnet_backend" {
  name                 = "lowtechgmbh-sn-backend"
  resource_group_name  = azurerm_resource_group.main_rg.name
  virtual_network_name = azurerm_virtual_network.vn.name
  address_prefixes     = ["10.0.3.0/24"]
  service_endpoints    = ["Microsoft.Storage"]
  delegation {
    name = "fs"
    service_delegation {
      name = "Microsoft.Web/serverFarms"
      actions = [
        "Microsoft.Network/virtualNetworks/subnets/action",
      ]
    }
  }
  depends_on = [azurerm_virtual_network.vn]
}


resource "azurerm_private_dns_zone" "private_dns_zone" {
  name                = "lowtechgmbh.postgres.database.azure.com"
  resource_group_name = azurerm_resource_group.main_rg.name
  depends_on          = [azurerm_resource_group.main_rg]
}

resource "azurerm_private_dns_zone_virtual_network_link" "vnet_link" {
  name                  = "lowtechgmbh.com"
  private_dns_zone_name = azurerm_private_dns_zone.private_dns_zone.name
  virtual_network_id    = azurerm_virtual_network.vn.id
  resource_group_name   = azurerm_resource_group.main_rg.name
  depends_on            = [azurerm_subnet.vn_subnet]
}


module "db" {
  source      = "./postgresql"
  username    = var.POSTGRESQL_USERNAME
  password    = var.POSTGRESQL_PASSWORD
  location    = azurerm_resource_group.main_rg.location
  rg_name     = azurerm_resource_group.main_rg.name
  dns_zone_id = azurerm_private_dns_zone.private_dns_zone.id
  subnet_id   = azurerm_subnet.vn_subnet.id
  depends_on  = [azurerm_private_dns_zone_virtual_network_link.vnet_link]
}


module "backend" {
  source                         = "./appservice"
  location                       = azurerm_resource_group.main_rg.location
  rg_name                        = azurerm_resource_group.main_rg.name
  subnet_id                      = azurerm_subnet.vn_subnet_backend.id
  db_url                         = "${var.POSTGRESQL_USERNAME}:${var.POSTGRESQL_PASSWORD}@${module.db.db_url}:5432"
  mail_from                      = var.MAIL_FROM
  mail_password                  = var.MAIL_PASSWORD
  mail_port                      = var.MAIL_PORT
  mail_server                    = var.MAIL_SERVER
  mail_username                  = var.MAIL_USERNAME
  scm_do_build_during_deployment = "1"
  depends_on                     = [module.db]

}

module "frontend" {
  source     = "./staticwebapp"
  depends_on = [module.backend]
}
