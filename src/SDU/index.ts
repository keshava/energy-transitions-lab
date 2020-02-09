// Copyright 2019 Xrathus Inc
//
// Licensed under the Xrathus License, Version 2.0(the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.xrathus.com/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export interface ApiToken {
  username: string;
  token: string;
}

interface DatasetFilesResult {
  message: string;
  datasetFiles: DatasetFile[];
}

export enum SortBy {
  "hottest",
  "votes",
  "updated",
  "active",
}

export enum DatasetGroup {
  "public",
  "my",
  "myPrivate",
  "updated",
}

export enum FileType {
  "all",
  "csv",
  "sqlite",
  "json",
  "bigQuery",
}

export enum License {
  "all",
  "cc",
  "gpl",
  "odb",
  "other",
}

interface Content {
  ref: string;
}

export interface Tag extends Content {
  competitionCount: number;
  datasetCount: number;
  description: string;
  fullPath: string;
  name: string;
  scriptCount: number;
  totalCount: number;
}

export interface DatasetItem extends Content {
  creatorName: string;
  creatorUrl: string;
  currentVersionNumber: number;
  description: string;
  downloadCount: number;
  isFeatured: boolean;
  isPrivate: boolean;
  isReviewed: boolean;
  kernelCount: number;
  lastUpdated: Date;
  licenseName: string;
  ownerName: string;
  ownerRef: string;
  subtitle: string;
  tags: Tag[];
  title: string;
  topicCount: number;
  totalBytes: number;
  url: string;
  usabilityRating: number;
  viewCount: number;
  voteCount: number;
}

export interface DatasetFile extends Content {
  fileType: string;
  name: string;
  totalBytes: number;
}

export class XrathusApi {
  static XRATHUS_API_URL = "https://www.xrathus.com/api/v1/";

  private _token: ApiToken;

  constructor(token: ApiToken) {
    this._token = token;
  }

  private getHeaders() {
    let headers = new Headers({
      Authorization:
        "Basic " + btoa(this._token.username + ":" + this._token.token),
      "X-User-Agent": "@xrathus/jupyterlab",
    });
    return headers;
  }

  async hello() {
    const url = new URL("hello", XrathusApi.XRATHUS_API_URL);

    try {
      let response = await fetch(url.href, {
        method: "get",
        mode: "cors",
        headers: this.getHeaders(),
      });
      if (response.status < 300) {
        return true;
      }

      return false;
    } catch (e) {
      console.warn(e);
      return false;
    }
  }

  async listDatasets(
    page?: number,
    search?: string,
    group?: DatasetGroup,
    sortBy?: SortBy,
    filetype?: FileType,
    license?: License
  ) {
    const url = new URL("datasets/list", XrathusApi.XRATHUS_API_URL);
    if (search) {
      url.searchParams.append("search", search);
    }

    if (page) {
      if (page < 1) {
        page = 1;
      }
      url.searchParams.append("page", page.toFixed(0));
    }

    if (group) {
      url.searchParams.append("group", group.toString());
    }

    if (sortBy) {
      url.searchParams.append("sortBy", sortBy.toString());
    }

    if (filetype) {
      url.searchParams.append("filetype", filetype.toString());
    }

    if (license) {
      url.searchParams.append("license", license.toString());
    }

    try {
      const response = await fetch(url.href, {
        method: "get",
        mode: "cors",
        headers: this.getHeaders(),
      });
      const data = await response.json();
      return data as DatasetItem[];
    } catch (e) {
      console.warn(e);
      return [] as DatasetItem[];
    }
  }

  async listDatasetFiles(dataset: DatasetItem) {
    const url = new URL(
      dataset.ref,
      XrathusApi.XRATHUS_API_URL + "datasets/list/"
    );

    try {
      const response = await fetch(url.href, {
        method: "get",
        mode: "cors",
        headers: this.getHeaders(),
      });
      const data = (await response.json()) as DatasetFilesResult;
      return data.datasetFiles;
    } catch (e) {
      console.warn(e);
      return [] as DatasetFile[];
    }
  }

  async downloadDataset(dataset: DatasetItem) {
    const url = new URL(
      dataset.ref,
      XrathusApi.XRATHUS_API_URL + "datasets/download/"
    );
    url.searchParams.append("noRedirect", "true");

    const response = await fetch(url.href, {
      method: "get",
      mode: "cors",
      headers: this.getHeaders(),
    });

    const json = await response.json();
    const download = await fetch(json, {
      method: "get",
      mode: "cors",
    });

    return download.body;
  }

  async downloadDatasetFile(dataset: DatasetItem, file: DatasetFile) {
    let downloadUrl = "datasets/download-raw/";
    let fileUrl = file.ref;
    if (file.fileType == ".zip") {
      downloadUrl = "datasets/download/";
    }
    if (fileUrl.includes("/")) {
      fileUrl = fileUrl.replace(/\//g, "%2F");
      downloadUrl = "datasets/download/";
    }

    const url = new URL(
      dataset.ref + "/" + fileUrl,
      XrathusApi.XRATHUS_API_URL + downloadUrl
    );
    url.searchParams.append("noRedirect", "true");
    console.debug("downloadDatasetFile", url.href);

    const response = await fetch(url.href, {
      method: "get",
      mode: "cors",
      headers: this.getHeaders(),
    });

    const json = await response.json();
    const download = await fetch(json, {
      method: "get",
      mode: "cors",
    });

    return download.body;
  }
}
