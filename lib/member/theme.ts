import type {
  MemberLevel,
} from "./index";

export type MemberTheme = {
  background: string;
  border: string;
  accent: string;
};

export function getMemberTheme(
  level: MemberLevel,
): MemberTheme {

  switch (level) {

    case "Bronze":
      return {
        background: "from-amber-900 to-orange-700",
        border: "border-amber-500",
        accent: "text-amber-300",
      };

    case "Silver":
      return {
        background: "from-slate-500 to-slate-700",
        border: "border-slate-300",
        accent: "text-slate-100",
      };

    case "Gold":
      return {
        background: "from-yellow-500 to-amber-700",
        border: "border-yellow-300",
        accent: "text-yellow-100",
      };

    case "Diamond":
      return {
        background: "from-cyan-500 to-blue-700",
        border: "border-cyan-300",
        accent: "text-cyan-100",
      };

    case "Legend":
      return {
        background: "from-fuchsia-600 via-violet-700 to-indigo-900",
        border: "border-fuchsia-300",
        accent: "text-fuchsia-100",
      };

    default:
      return {
        background: "from-gray-800 to-gray-900",
        border: "border-gray-500",
        accent: "text-white",
      };
  }
}
