const request = require("supertest");
const ProjectService = require("../ProjectService");

let server;
describe("/api/projects", () => {
  beforeEach(() => {
    server = require("../../bin/www");
  });
  afterEach(async () => {
    server.close();
    await ProjectService.deleteAllProjects();
  });

  describe("GET /", () => {
    it("should return all projects", async () => {
      // dummy project
      const project = {
        CompanyID: 1,
        Name: "dummy project",
        ContextID: 1,
        Latitude: 1111,
        Longitude: 2222,
        StateID: 1,
        RegionID: 1,
        Deadline: "2020-02-23 09:39:46",
        RadiusCovered: 25,
        CommonWealth: 1
      };

      // save to test database to return
      await ProjectService.saveProject(project);
      // test get request
      const res = await request(server).get("/api/projects");

      expect(res.status).toBe(200);
      expect(typeof res.body.all).toBe("object");
      expect(res.body.all[0].CompanyID).toBe(1);
      expect(res.body.all[0].Name).toBe("dummy project");
      expect(res.body.all[0].ContextID).toBe(1);
      expect(res.body.all[0].Latitude).toBe(1111);
      expect(res.body.all[0].Longitude).toBe(2222);
      expect(res.body.all[0].StateID).toBe(1);
      expect(res.body.all[0].RegionID).toBe(1);
      expect(res.body.all[0].Deadline).toBe("2020-02-22T23:39:46.000Z");
      expect(res.body.all[0].RadiusCovered).toBe(25);
      expect(res.body.all[0].CommonWealth).toBe(1);
    });
  });
});
