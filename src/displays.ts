
export class Display {
  name: string;
  height: number;
  width: number;
  default_password: string;

  constructor(name: string, height: number, width: number, default_password: string) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.default_password = default_password;
  }
}

export const displays: Record<string, Display> = {
  "waveshare_7.5": new Display("Waveshare 7.5\"", 480, 800, "1234"),
}

export enum Orientation {
  LANDSCAPE = "Landscape",
  PORTRAITC = "Portrait clockwise",
  PORTRAITA = "Portrait anticlockwise",
  LANDSCAPEI = "Inverted Landscape",
}
