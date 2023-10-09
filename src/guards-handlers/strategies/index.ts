import { Provider } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';

export * from './local.strategy';

export const STRATEGIES: Provider[] = [LocalStrategy];
