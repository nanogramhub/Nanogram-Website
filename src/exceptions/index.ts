class UserNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundException";
  }
}

class UnauthorizedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
  }
}

export { UnauthorizedException, UserNotFoundException };
