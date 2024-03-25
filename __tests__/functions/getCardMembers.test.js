import { getCardMembers } from "../../functions.min.js";
import axios from "axios";

jest.mock("axios");

describe("getCardMembers", () => {
  it("returns data when getCardMembers is called", async () => {
    const mockData = [
      { id: "65dc9854e3957e9ff467a592", name: "matthieu roess" },
      { id: 2, name: "User 2" },
    ];
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getCardMembers("65dde46b36c2dc5b902f4a5f");
    expect(result).toEqual(mockData);
  });

  it("throws an error when request fails", async () => {
    axios.get.mockRejectedValue(new Error("Request failed"));

    await expect(getCardMembers("invalid-card-id")).rejects.toThrow();
  });
});
