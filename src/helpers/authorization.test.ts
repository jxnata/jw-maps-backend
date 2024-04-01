import { authorization } from "./authorization";

test('should return a valide 6-digit code', () => {
    expect(authorization()).toHaveLength(6);
});
