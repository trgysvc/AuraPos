Okay, I need to address the user's problem where they used Express in their code, which violates the Native Manifesto's strict no-middleware policy. The user provided a code snippet that includes an Express middleware, which is a third-party library. My task is to refactor this code to use only Node.js built-in modules, specifically the native HTTP module.

First, I'll look at the existing code. The middleware uses Express's Request, Response, and NextFunction. I need to replace this with native HTTP handlers. So, I'll create a function that takes a role and a permission, and returns a request listener function.

Next, I'll adjust the hasPermission function to fit within the native HTTP context. I'll ensure it doesn't rely on Express-specific objects.

Then, I'll modify the example usage to use the native http.createServer method instead of Express. This means setting up the server manually and attaching the middleware as a request listener.

I also need to make sure that all imports are removed since we're not using Express anymore. The code should only use built-in modules like 'http' and 'url'.

Finally, I'll test the refactored code to ensure it correctly handles authentication and authorization without Express, adhering strictly to the Native Manifesto.
</think>

```typescript
// src/auth/role-permissions.ts

export enum RoleEnum {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF'
}

export enum PermissionEnum {
  CREATE_ORDER = 'CREATE_ORDER',
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_REPORTS = 'VIEW_REPORTS',
  UPDATE_MENU = 'UPDATE_MENU',
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS'
}

export interface RolesPermissionsMap {
  [RoleEnum.ADMIN]: PermissionEnum[];
  [RoleEnum.MANAGER]: PermissionEnum[];
  [RoleEnum.STAFF]: PermissionEnum[];
}

export const ROLES_PERMISSIONS: RolesPermissionsMap = {
  [RoleEnum.ADMIN]: [
    PermissionEnum.CREATE_ORDER,
    PermissionEnum.MANAGE_USERS,
    PermissionEnum.VIEW_REPORTS,
    PermissionEnum.UPDATE_MENU,
    PermissionEnum.MANAGE_PAYMENTS
  ],
  [RoleEnum.MANAGER]: [
    PermissionEnum.CREATE_ORDER,
    PermissionEnum.VIEW_REPORTS,
    PermissionEnum.UPDATE_MENU,
    PermissionEnum.MANAGE_PAYMENTS
  ],
  [RoleEnum.STAFF]: [
    PermissionEnum.CREATE_ORDER,
    PermissionEnum.VIEW_REPORTS
  ]
};

export function hasPermission(role: RoleEnum, permission: PermissionEnum): boolean {
  return ROLES_PERMISSIONS[role].includes(permission);
}

// src/auth/auth.middleware.ts

import { hasPermission } from './role-permissions';
import http from 'http';

export function authMiddleware(role: RoleEnum, permission: PermissionEnum) {
  return (req: http.IncomingMessage, res: http.ServerResponse, next: (err?: Error) => void) => {
    if (!req.headers.authorization) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized' }));
      return;
    }

    if (!hasPermission(role, permission)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Forbidden' }));
      return;
    }

    next();
  };
}

// src/models/user.model.ts

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_USER_ROLE: string = 'STAFF';

// Usage example:
import http from 'http';
import { authMiddleware } from './auth/auth.middleware';

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url!, 'http://localhost');

  if (pathname === '/orders') {
    authMiddleware(RoleEnum.ADMIN, PermissionEnum.VIEW_REPORTS)(req, res, () => {
      // Handle request
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Orders retrieved' }));
    });
  }
});

server.listen(3000);
```