# Roadmap

- Assessment
- Design
- Execution
- Optimization and management

### Assessment

This is one of the most critical steps, given that we need to establish a baseline of performance, and cost of the current infrastructure. During this stage we are going to execute the following tasks:

- Review the current infrastructure in terms of performance, data requirements, availability and security. Establishing baseline metrics we then have some rough idea of the areas we want to pay attention, and  at the end, the total impact that the migration had
- Check the current applications, to define a migration approach, if they can be migrated, changed, or improved in a way that makes the transition process easier
- Identify the level of effort per department/application/domain to make the migration, this metrics will guide the order of the execution.
- Asses the budget and space constraints for new hardware, or to rent such services.
- Check the technologies in which we are going to build the migration IE → Open Stack or Proxmox
- Check the specs of the new hardware we need for migration, and check if we can reuse something from the current deployment

### Design

In this step we perform the following tasks. 

- Design the new architecture diagram with networking isolation between domains.
- Document which applications will be migrated to new technologies, or will be ported as is
- Create the ordering document which will detail the dates to migrate each application
- Prepare contingency plans, and fallbacks to minimize disruption to the business if a migration fails.
- Gather all the technical documentation regarding the implementation for the application migrations to new technologies.

### Execution

- Acquire the new hardware
- Provision the physical server and install the necessary software, including the hardware and software security
- Dockerize and modernize applications
    - Finance
    - HR
    - Warehouse → Possibly not needed
    - Operations
    - Webshop
    
    When dockerizing applications, try to create portable images so we can use those to transition to the cloud. It will also enable automatic deploys of changes, updates or new versions. During this step we should also create a private docker image registry to store the final images for download. This is not necessary but it will make deployments easier
    
    We also need to modernize the tools, and standardize the software stack if possible.
    
    > Not all applications can be modernized, we cannot change the source code, we can just reinstall them, but dockerizing them will take a long time and it is not possible at the moment.
    > 
    
    <aside>
    💡
    
    It is ok if we have an elasticity constraint, since we can only create new virtual machines, but it is still better than what they have right now.
    
    </aside>
    
- Test the dockerized applications, we can test that applications running in docker behave essentially the same as the installed counterparts
- Provision and install the private cloud management software, including the networking configuration
- Configure the storage
- Create the virtual machines for the base hosts
- Establish the network links between the different virtual domains
- Install all database servers
- Develop a migration process to replicate the current data into the new database servers.
- Review that data is up to parity with the legacy services
- Create a proxy getaway for the services, so we can redirect the traffic from the old services to the new ones.
- Deploy the new applications into the private cloud
- Check that the data replication is working
- Prepare the load shifting in sequence, and off hours
- Shift load in sequence, starting from the most isolated applications first, then the ones with the most dependencies.
    - Migrate finance or HR, since they are self-contained
    - Migrate operations
    - Migrate customer service
    - Migrate warehouse
    - Migrate webshop
    - Migrate sales

### Optimization

Instrument and measure the performance of the system and create an assessment report of the migration.

Create documentation regarding the new deployment process, provisioning and scaling.

Assess the infrastructure, and check future improvement plans.

Once we have the dockerized applications, we could start thinking into migrating to more updated technologies, and trying to leverage cloud first strategies. Like lambdas for example, for the workloads that don’t need to be online 100% of the time.

During optimization we need to also allocate time, for training and documentation of the different processes on how to scale, deploy and provision new services.

This are on a high level which tasks need to be performed to have a successful transition. Ideally we can start small, and not cause major disruptions if the transition to one application does not work as expected. 

→ Some open questions, what is the budget?

→ What is the time we have for this project?

→ Do we have the source code for the applications? 

→ What is the current talent, and workforce at my disposal?

### Comments

→ No infinite budget, but we can state that the features asked cost a lot of money

→ We cannot use kubernetes and docker, for everything, but it is possible to some degree

→ We wont have full elasticity since what we can do is virtualize every application, we need a vm orchestrator
