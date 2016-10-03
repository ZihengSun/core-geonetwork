.. _configuring-database:


Configuring the database
########################

This section describe how to configure the database connection.

By default, an `H2 <http://www.h2database.com/html/main.html>`_ database is configured
and created when the application first start. The H2 database named ``geonetwork.h2.db``
is created:

* when using the installer, in the ``jetty`` folder

* when deploying the WAR on Tomcat and using ``startup.sh``, in the ``bin`` folder of Tomcat


To modify the database configuration, first check which type of database is used.
Depending on the node (default node name is |default.node|) check the node configuration file
|default.node.config.file|. Choose the database type to use.

Then update the |jdbc.properties| file with connection information.

The database default structure will be created by the application on startup.


To have more details about database connection and queries, log can be switched to DEBUG level
in :code:`web/src/main/webapp/WEB-INF/classes/log4j.xml` (or see :ref:`system-config-server` > Log level).


.. code-block:: xml

    <logger name="org.hibernate.SQL" additivity="false">
        <level value="DEBUG" />
        <appender-ref ref="consoleAppender" />
        <appender-ref ref="fileAppender" />
    </logger>
    <logger name="org.hibernate.type" additivity="false">
        <level value="DEBUG" />
        <appender-ref ref="consoleAppender" />
        <appender-ref ref="fileAppender" />
    </logger>
    <logger name="org.hibernate.tool.hbm2ddl" additivity="false">
        <level value="DEBUG" />
        <appender-ref ref="consoleAppender" />
        <appender-ref ref="fileAppender" />
    </logger>
