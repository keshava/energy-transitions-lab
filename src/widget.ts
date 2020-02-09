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

import { PanelLayout, Widget } from "@phosphor/widgets";
import { ToolbarButton, Toolbar } from "@jupyterlab/apputils";
import { DatasetPickerWidget } from "./widgets/datasetPicker";
import { ApiSettingsWidget } from "./widgets/apiSettings";
import { XrathusService } from "./service";

export class XrathusWidget extends Widget {
  private _toolbar: Toolbar;
  private _settingsButton: ToolbarButton;
  private _datasetButton: ToolbarButton;

  private _rootPanel: PanelLayout;
  private _settingsPanel: Widget;
  private _datasetPickerWidget: Widget;

  constructor(service: XrathusService) {
    super();
    this.addClass("jp-Xrathus");

    this.id = "xrathus-widget";
    this.title.iconClass = "jp-Xrathus-icon jp-SideBar-tabIcon";
    this.title.caption = "Import Xrathus content";

    this._toolbar = new Toolbar();

    this._rootPanel = new PanelLayout();
    this._rootPanel.addWidget(this._toolbar);
    this.layout = this._rootPanel;

    this._datasetPickerWidget = new DatasetPickerWidget(service);
    this._settingsPanel = new ApiSettingsWidget(service);
    service.onTokenChangeAccepted = () => {
      this._settingsPanel.parent = null;
      this._rootPanel.addWidget(this._datasetPickerWidget);
    };

    if (service.isReady()) {
      this._rootPanel.addWidget(this._datasetPickerWidget);
    } else {
      this._rootPanel.addWidget(this._settingsPanel);
    }

    this._settingsButton = new ToolbarButton({
      onClick: () => {
        this._datasetPickerWidget.parent = null;
        this._rootPanel.addWidget(this._settingsPanel);
      },
      iconClassName: "jp-SettingsIcon",
      tooltip: "Configure Xrathus extension.",
    });
    this._toolbar.addItem("Config", this._settingsButton);

    this._datasetButton = new ToolbarButton({
      onClick: () => {
        if (service.isReady()) {
          this._settingsPanel.parent = null;
          this._rootPanel.addWidget(this._datasetPickerWidget);
        }
      },
      iconClassName: "jp-SearchIcon",
      tooltip: "Browse Xrathus Datasets.",
    });
    this._toolbar.addItem("Dataset", this._datasetButton);
  }
}
