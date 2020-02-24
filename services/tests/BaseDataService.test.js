const request = require("supertest");
const BaseDataService = require("../BaseDataService");

let server;

describe("/api/speciesList", () => {
  beforeEach(() => {
    server = require("../../bin/www");
  });

  afterEach(async () => {
    server.close();
    // await ProjectService.deleteAllProjects();
  });

  describe("GET /", () => {
    it("it should return status 200", async () => {
      const res = await request(server).get("/api/speciesList");

      expect(res.status).toBe(200);
    });
  });

  describe("POST /api/speciesList", () => {
    it("it return species if the queried species is found in data base", async () => {
      const query = {
        searchType: "name",
        searchQuery: "Hylacola cautus"
      };
      const res = await request(server)
        .post("/api/speciesList")
        .send(query);

      expect(res.status).toBe(200);
    });
  });
});
