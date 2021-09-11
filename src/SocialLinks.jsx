import * as React from "react";
import { RiGithubLine, RiTwitterLine } from "react-icons/ri";
import { IconContext } from "react-icons";

export default function SocialLinks() {
  return <IconContext.Provider value ={{size: "3rem", className: 'socialIcon'}}>
  <div class="socialLinks">
    <a href="https://github.com/dylf" target="_blank"><RiGithubLine /></a>
    <a href="https://twitter.com/dylanjfontaine" target="_blank"><RiTwitterLine /></a>
  </div>
  </IconContext.Provider>
}