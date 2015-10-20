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

## 1.7.0

Release date : 20151020

### neServer.routes = function(server, dirName, optionsObject)

(CI, CO)
- If the ne-server module is deeper into the node_modules folder it is needed to provide a relative path back to the /app/routes folder.
- This is done using the optionsObject.pathToRoutes 
- optionsObject.pathToRoutes = "../../../../app/routes/";


