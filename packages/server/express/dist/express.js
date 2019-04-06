"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const morgan_1 = require("morgan");
const helmet_1 = require("helmet");
class GExpress {
    constructor(options, middlewares) {
        this.options = options;
        this.app = express();
        this.middlewares = middlewares;
        this.app.use(morgan_1.default("combined")); // FIXME Add '{ stream:  }' param when we get a logger module
        this.app.use(helmet_1.default());
        this.middlewares.forEach((middleware) => {
            this.app.use(middleware);
        });
        this.app.get("/health", (req, res) => {
            return res.status(200).send("OK");
        });
        // TODO Default error handling middleware?
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server = this.app.listen(this.options.port);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server && this.server.close();
        });
    }
    addRouter(params) {
        const { route = "/", router } = params;
        this.app.use(route, router);
    }
}
exports.default = GExpress;
//# sourceMappingURL=express.js.map