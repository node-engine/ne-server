# ne-server changelog

## Change Tags

Bug
- BF Bug fix: Fixed a bug

Optimisation
- OO Optimisation: The internal workings of the module is improved 
- OR Refactor: The internal code is refactored

Change
- CI Input change: What is required as input for the module is changed
- CO Output change: What is output by the module is changed

Dependencies
- DN New Dependency: A new dependency is added to the package
- DR Remove Dependency: A  dependency is removed from the package
- DU Update Dependency: A dependency is updated in the package


# 1.8.3

Release date: 20151021

[BF]
Fixed neServer.routes require paths


# 1.8.2

Release date: 20151020

Removed 1.8.0
- caused too many bugs


# 1.8.1

Release date: 20151020

[BF]
Fixes bugs cuased by 1.8.0
[DN]
ne-auto-off

# 1.8.0

Release date: 20151020

[BF][DN]
All require statements 
- When using ne-auto the require statements did not find the module
- Are now conditional to be compatible with ne-auto
- If there is a process.env.NE_AUTO then the require statements use the ne-auto if not then they require from root
- Now this module will work with ne-auto and without ne-auto
- DN tag because this is connected to dependencies 

Removed sample ne-server file

Removed code samples

## 1.7.0

Release date : 20151020

### neServer.routes = function(server, dirName, optionsObject)

(CI, CO)
- If the ne-server module is deeper into the node_modules folder it is needed to provide a relative path back to the /app/routes folder.
- This is done using the optionsObject.pathToRoutes 
- optionsObject.pathToRoutes = "../../../../app/routes/";


