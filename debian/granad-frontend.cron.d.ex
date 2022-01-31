#
# Regular cron jobs for the tux-frontend package
#
0 4	* * *	root	[ -x /usr/bin/tux-frontend_maintenance ] && /usr/bin/tux-frontend_maintenance
