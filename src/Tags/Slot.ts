/**
 * @module tags
 */

/*
* edge
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { Parser } from 'edge-parser'
import { EdgeBuffer } from 'edge-parser/build/src/EdgeBuffer'
import { ITagToken } from 'edge-lexer/build/src/Contracts'

export class SlotTag {
  public static block = true
  public static seekable = true
  public static selfclosed = false
  public static tagName = 'slot'

  public static compile (parser: Parser, buffer: EdgeBuffer, token: ITagToken) {
    token.children.forEach((child) => {
      parser.processToken(child, buffer)
    })
  }
}
