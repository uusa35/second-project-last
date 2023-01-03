import { createDevTools } from '@redux-devtools/core';
import { RtkQueryMonitor } from '@redux-devtools/rtk-query-monitor';

export default createDevTools(<RtkQueryMonitor />);
