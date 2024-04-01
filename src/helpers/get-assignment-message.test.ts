import { getAssignmentMessage } from "./get-assignment-message";


test('should return a string with correct order', () => {
    expect(getAssignmentMessage("map", "user", "expiration")).toBe("map-user-expiration");
});