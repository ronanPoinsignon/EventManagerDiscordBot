export class WebException {
    
    private status: number;
    message: string;

    constructor(status: number, message: string) {
        this.status = status;
        this.message = message;
    }
}

export class NotFoundException extends WebException {
    constructor(message: string) {
        super(404, message);
    }
}

export class BadRequestException extends WebException {
    constructor(message: string) {
        super(400, message);
    }
}

export class UnauthorizedException extends WebException {
    constructor(message: string) {
        super(401, message);
    }
}

export class ForbiddenException extends WebException {
    constructor(message: string) {
        super(403, message);
    }
}

export class InternalServerErrorException extends WebException {
    constructor(message: string) {
        super(500, message);
    }
}