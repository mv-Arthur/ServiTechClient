import { makeAutoObservable } from "mobx";
import { GetAllAccResponse } from "../models/response/AccResponse";
import { AccService } from "../services/AccService";
import { OrgResponse } from "../models/response/OrgResponse";

class AccStore {
  report = [] as GetAllAccResponse[];
  org = {} as OrgResponse;
  constructor() {
    makeAutoObservable(this, {}, { deep: true });
  }

  addFetcht(data: GetAllAccResponse[]) {
    this.report = [...data];
  }

  setOrg(org: OrgResponse) {
    this.org = org;
  }

  setAvatar(avatar: string) {
    this.org.avatar = avatar;
  }

  async fetchReports() {
    try {
      const response = await AccService.getAllAcc();
      this.addFetcht(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async fetchOrg(id: number) {
    try {
      const response = await AccService.getOrg(id);
      this.setOrg(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async edit(org: OrgResponse) {
    try {
      const response = await AccService.editOrg(org);
      this.setOrg(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  async editAvatar(fromData: FormData) {
    try {
      const response = await AccService.editAvatar(fromData);
      this.setAvatar(response.data);
    } catch (err) {
      console.log(err);
    }
  }
}

export const accStore = new AccStore();
