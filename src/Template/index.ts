/**
 * @module main
 */

/*
* edge
*
* (c) Harminder Virk <virk@adonisjs.com>
*
* For the full copyright and license information, please view the LICENSE
* file that was distributed with this source code.
*/

import { merge } from 'lodash'
import { Context } from '../Context'
import { Compiler } from '../Compiler'
import { Presenter as BasePresenter } from '../Presenter'

/**
 * The template is used to compile and run templates. Also the instance
 * of template is passed during runtime to render `dynamic partials`
 * and `dynamic components`.
 */
export class Template {
  private sharedState: any

  constructor (private compiler: Compiler, globals: any, locals: any) {
    this.sharedState = merge({}, globals, locals)
  }

  /**
   * Render the template inline by sharing the state of the current template.
   *
   * ```js
   * const partialFn = template.renderInline('includes.user')
   *
   * // render and use output
   * partialFn(template, ctx)
   * ```
   */
  public renderInline (templatePath: string): Function {
    return new Function('template', 'ctx', this.compiler.compile(templatePath, true).template)
  }

  /**
   * Renders the template with custom state. The `sharedState` of the template is still
   * passed to this template.
   *
   * Also a set of custom slots can be passed along. The slots uses the state of the current
   * template.
   *
   * ```js
   * template.renderWithState('components.user', { username: 'virk' }, slotsIfAny)
   * ```
   */
  public renderWithState (template: string, state: object, slots: object): string {
    const { template: compiledTemplate, Presenter } = this.compiler.compile(template, false)
    const presenter = new (Presenter || BasePresenter)(Object.assign(state, { $slots: slots }))
    const ctx = new Context(presenter, this.sharedState)

    return new Function('template', 'ctx', `return ${compiledTemplate}`)(this, ctx)
  }

  /**
   * Render a template with it's state.
   *
   * ```js
   * template.render('welcome', { key: 'value' })
   * ```
   */
  public render (template: string, state: object): string {
    const { template: compiledTemplate, Presenter } = this.compiler.compile(template, false)
    const presenter = new (Presenter || BasePresenter)(state)
    const ctx = new Context(presenter, this.sharedState)

    return new Function('template', 'ctx', `return ${compiledTemplate}`)(this, ctx)
  }
}
