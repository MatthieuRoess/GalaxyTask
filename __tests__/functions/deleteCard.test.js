import { deleteCard } from "../../functions.min.js";
import axios from "axios";

jest.mock("axios");

describe("deleteCard", () => {
  it("deletes a card when deleteCard is called", async () => {
    const mockData = { success: true };
    axios.delete.mockResolvedValue({ data: mockData });

    const result = await deleteCard("65dde4bebbb2fdd4d60ed9c8");
    expect(result).toEqual(mockData);
  });

  it("throws an error when request fails", async () => {
    axios.delete.mockRejectedValue(new Error("Request failed"));

    await expect(deleteCard("invalid-card-id")).rejects.toThrow();
  });
});
