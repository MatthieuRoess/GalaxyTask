import { postNewList } from "../../functions.min.js";
import axios from "axios";
import { TRELLO_ID } from "@env";

jest.mock("axios");

describe("postNewList", () => {
  it("creates a new list when postNewList is called", async () => {
    const mockData = { id: "new-list-id", name: "New List" };
    axios.post.mockResolvedValue({ data: mockData });

    const result = await postNewList(TRELLO_ID, "New List");
    expect(result).toEqual(mockData);
  });

  it("throws an error when request fails", async () => {
    axios.post.mockRejectedValue(new Error("Request failed"));

    await expect(
      postNewList("invalid-board-id", "Invalid List")
    ).rejects.toThrow();
  });
});
