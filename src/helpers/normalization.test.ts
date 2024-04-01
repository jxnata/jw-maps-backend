import { normalization } from "./normalization";


test('should normalize a string', () => {
    expect(normalization("J:ãM_ez Doe")).toBe("jamezdoe");
});