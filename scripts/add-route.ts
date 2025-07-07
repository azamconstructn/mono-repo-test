import fs from "fs";
import path from "path";

const [, , servicePath, httpMethod, routePath] = process.argv;

if (!servicePath || !httpMethod || !routePath) {
  console.error(
    "Usage: ts-node add-route.ts <service-path> <PUT|POST> <route-path>",
  );
  process.exit(1);
}

const method = httpMethod.toLowerCase();
const name = routePath.replace(/\//g, "_").replace(/^_+|_+$/g, "");

const pascalName = name
  .split("_")
  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  .join("");
const camelName = pascalName.charAt(0).toLowerCase() + pascalName.slice(1);

// Update route file
const routeFile = path.join(servicePath, "src/routes/user.route.ts");
let routeCode = fs.readFileSync(routeFile, "utf8");
if (!routeCode.includes(`router.${method}('${routePath}'`)) {
  const insert = `router.${method}('${routePath}', ${camelName}Controller);`;
  routeCode = routeCode.replace(
    /(const router = Router\(\);\n)/,
    `$1
${insert}
`,
  );
  fs.writeFileSync(routeFile, routeCode);
  console.log(`✅ Route added to router: ${routePath} [${httpMethod}]`);
}

// Update controller
const controllerFile = path.join(
  servicePath,
  "src/controllers/user.controller.ts",
);
let controllerCode = fs.readFileSync(controllerFile, "utf8");
if (!controllerCode.includes(`export const ${camelName}Controller`)) {
  const ctrlFn = `
export const ${camelName}Controller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${camelName}Service(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};`;
  controllerCode += ctrlFn;
  fs.writeFileSync(controllerFile, controllerCode);
  console.log(`✅ Controller method '${camelName}Controller' added.`);
}

// Update service
const serviceFile = path.join(servicePath, "src/services/user.service.ts");
let serviceCode = fs.readFileSync(serviceFile, "utf8");
if (!serviceCode.includes(`export const ${camelName}`)) {
  const svcFn = `
export const ${camelName} = async (data: any) => {
  // TODO: Implement logic for ${routePath}
  return { message: 'Handled ${routePath}' };
};`;
  serviceCode += svcFn;
  fs.writeFileSync(serviceFile, serviceCode);
  console.log(`✅ Service method '${camelName}' added.`);
}
