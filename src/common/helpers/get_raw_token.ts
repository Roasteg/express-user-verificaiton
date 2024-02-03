export default function getRawToken(token: string): string {
    return token.replace(/^Bearer\s/, '');
}