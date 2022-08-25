interface Hello {
  name:string,
  description:string,
  protocol:string,
  property:{
    native_server:boolean,
    upload_bandwidth:number,
    sync_interval:0,
    official_maintained:boolean,
  },
  services:{
    name:string,
    path:string,
  }[],
  plugins?:{
    tree: Record<string, PluginData>,
    path: string,
  },
  iso?:FileNode,
  alpha?:{
    wim:FileNode,
    cover:{
      lower_than:string,
      url:string,
    }
  },
  ventoy?:{
    windows:FileNode,
    plugin:string,
  },
  hub?:{
    latest:{
      version:string,
      page:string,
    },
    update:{
      allow_normal_since:string,
      force_update_until:string,
      wide_gaps:string[]
    },
    notices:{
      id:string,
      channel:string,
      level:string,
      message:string,
      description:string,
      close_text:string,
      lower_than:string,
      repeat_after:string,
    }[],
    packages: {
      update: string,
      extended_update: string,
      full: string,
    }
  }
}

interface FileNode {
  version: string,
  file_name: string,
  url: string,
}

interface PluginData {
  name: string,
  size: number,
  timestamp: number,
  hash: string,
}

interface ParsedFullName {
  name: string,
  version: string,
  author: string,
  isBot: boolean,
  ext: string
}

type TaskStatus = {
  state: "Available" | "Downloading" | "Pending" | "Installing" | "Installed" | "Upgradable",
  versionLocal: string,
  versionOnline: string,
  percentage?: number
}

export {
  Hello,
  PluginData,
  TaskStatus,
  ParsedFullName
}
