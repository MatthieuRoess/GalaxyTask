import { postCardMember } from "../../functions.min.js";
import axios from "axios";

jest.mock("axios");

describe("postCardMember", () => {
  it("returns data when postCardMember is called", async () => {
    const mockData = { success: true };
    axios.post.mockResolvedValue({ data: mockData });

    const result = await postCardMember(
      "65dde46b36c2dc5b902f4a5f",
      "65dc96b2e5d6f2f05d806201"
    );
    expect(result).toEqual(mockData);
  });

  it("throws an error when request fails", async () => {
    axios.post.mockRejectedValue(new Error("Request failed"));

    await expect(
      postCardMember("invalid-card-id", "invalid-member-id")
    ).rejects.toThrow();
  });
});
