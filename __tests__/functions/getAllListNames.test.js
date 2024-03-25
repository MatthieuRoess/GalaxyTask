import { getAllListNames } from "../../functions.min.js";
import axios from "axios";

jest.mock("axios");

describe("getAllListNames", () => {
  it("returns list names when getAllListNames is called", async () => {
    const mockData = [
      { id: 1, name: "List 1" },
      { id: 2, name: "List 2" },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getAllListNames();
    expect(result).toEqual(["List 1", "List 2"]);
  });

  it("throws an error when request fails", async () => {
    axios.get.mockRejectedValue(new Error("Request failed"));

    await expect(getAllListNames()).rejects.toThrow();
  });
});
