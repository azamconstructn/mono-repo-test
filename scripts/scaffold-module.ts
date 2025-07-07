import fs from "fs";
import path from "path";

const [, , servicePath, moduleName] = process.argv;

if (!servicePath || !moduleName) {
  console.error(
    "Usage: ts-node scaffold-module.ts <service-path> <module-name>",
  );
  process.exit(1);
}

const pascalName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

const files = {
  [`src/routes/${moduleName}.route.ts`]: `import { Router } from 'express';
import { create${pascalName}Controller, get${pascalName}ByIdController } from '../controllers/${moduleName}.controller';
const router = Router();

router.post('/', create${pascalName}Controller);
router.get('/:id', get${pascalName}ByIdController);

export default router;
`,

  [`src/controllers/${moduleName}.controller.ts`]: `import { Request, Response, NextFunction } from 'express';
import * as ${moduleName}Service from '../services/${moduleName}.service';

export const create${pascalName}Controller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${moduleName}Service.create${pascalName}(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const get${pascalName}ByIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${moduleName}Service.get${pascalName}ById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
`,

  [`src/services/${moduleName}.service.ts`]: `import { ${pascalName}Model } from '../infrastructure/${moduleName}.model';
import { Create${pascalName}Dto } from '../domain/${moduleName}.types';

export const create${pascalName} = async (data: Create${pascalName}Dto) => {
  const entity = new ${pascalName}Model(data);
  return entity.save();
};

export const get${pascalName}ById = async (id: string) => {
  return ${pascalName}Model.findById(id);
};
`,

  [`src/infrastructure/${moduleName}.model.ts`]: `import mongoose from 'mongoose';
import { Create${pascalName}Dto } from '../domain/${moduleName}.types';

const schema = new mongoose.Schema<Create${pascalName}Dto>({
  name: String,
  email: String
}, { timestamps: true });

export const ${pascalName}Model = mongoose.model('${pascalName}', schema);
`,

  [`src/domain/${moduleName}.types.ts`]: `export interface Create${pascalName}Dto {
  name: string;
  email: string;
}
`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(servicePath, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

console.log(`✅ Module '${moduleName}' scaffolded in ${servicePath}`);
