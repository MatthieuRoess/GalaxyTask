import { getAllTasks } from "../../functions.min.js";
import axios from "axios";

jest.mock("axios");

describe("getAllTasks", () => {
  it("returns data when getAllTasks is called", async () => {
    const mockData = [
      { id: 1, name: "Task 1" },
      { id: 2, name: "Task 2" },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getAllTasks();
    expect(result).toEqual(mockData);
  });

  it("throws an error when request fails", async () => {
    axios.get.mockRejectedValue(new Error("Request failed"));

    await expect(getAllTasks()).rejects.toThrow();
  });
});
