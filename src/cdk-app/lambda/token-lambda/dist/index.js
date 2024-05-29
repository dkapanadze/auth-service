"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const data_source_1 = __importDefault(require("./data-source"));
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield data_source_1.default.initialize();
        const entityManager = data_source_1.default.manager;
        // Fetch all users from the database using a raw SQL query
        const expiredRefreshTokens = yield entityManager.query('SELECT * FROM refresh_token WHERE refresh_token.expires_at < NOW()');
        console.log(expiredRefreshTokens, 'expiredRefreshTokens');
        if (expiredRefreshTokens.length === 0) {
            console.log('No expired refresh tokens found');
            return 'No expired refresh tokens found';
        }
        yield entityManager.query('DELETE FROM refresh_token WHERE refresh_token.expires_at < NOW()');
        return 'Expired refresh tokens deleted successfully';
    }
    catch (err) {
        console.log('Err', err);
        throw new Error('Failed to delete expired refresh tokens');
    }
    finally {
        yield data_source_1.default.destroy();
    }
});
exports.handler = handler;
