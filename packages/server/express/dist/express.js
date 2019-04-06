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
const morgan = require("morgan");
const helmet = require("helmet");
class GExpress {
    constructor(options, middlewares, morganOptions) {
        this.options = options;
        this.app = express();
        this.middlewares = middlewares;
        this.app.use(morgan("combined", morganOptions));
        this.app.use(helmet());
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