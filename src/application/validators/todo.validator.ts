import { injectable } from 'inversify'

import { BaseValidator } from '@/application/validators/abstract/base.validator'

@injectable()
export class TodoValidator extends BaseValidator {}
