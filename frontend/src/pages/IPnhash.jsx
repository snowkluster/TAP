/* eslint-disable react/prop-types */

import { Box, Typography, Container, Divider, CircularProgress, Card, CardContent } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import SearchBar from '../components/SearchBar';

const IPnhash = () => {
  const [ipResult, setIpResult] = useState(null);
  const [ipLoading, setIpLoading] = useState(false);
  const [hashResult, setHashResult] = useState(null);
  const [hashLoading, setHashLoading] = useState(false);

  const handleIpSearch = async (ip) => {
    if (!ip) return;
    setIpLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8004/check_ip?ip=${ip}`);
      setIpResult(response.data);
    } catch (error) {
      console.error("Error fetching IP data:", error);
      setIpResult(null);
    } finally {
      setIpLoading(false);
    }
  };

  const handleHashSearch = async (hash) => {
    if (!hash) return;
    setHashLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8006/check/${hash}`);
      setHashResult(response.data);
    } catch (error) {
      console.error("Error fetching hash data:", error);
      setHashResult(null);
    } finally {
      setHashLoading(false);
    }
  };

  const preparePieData = (blocklists) => {
    if (!blocklists) return [];
    const listed = Object.entries(blocklists)
      .filter(([_, value]) => value)
      .map(([name]) => name);
    const notListed = Object.entries(blocklists)
      .filter(([_, value]) => !value)
      .map(([name]) => name);
  
    return [
      { name: 'Listed', value: listed.length, lists: listed },
      { name: 'Not Listed', value: notListed.length, lists: notListed }
    ];
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ backgroundColor: '#1E1E1E', p: 2, border: '1px solid #333', borderRadius: 1 }}>
          <Typography sx={{ color: '#FF9800' }}>{data.name}</Typography>
          <Typography variant="body2" sx={{ color: '#E0E0E0' }}>Count: {data.value}</Typography>
          <Typography variant="body2" sx={{ color: '#E0E0E0', mt: 1 }}>Lists:</Typography>
          <Box sx={{ maxWidth: 200 }}>
            {data.lists.map((list) => (
              <Typography key={list} variant="body2" sx={{ color: '#E0E0E0' }}>
                • {list}
              </Typography>
            ))}
          </Box>
        </Box>
      );
    }
    return null;
  };

  const COLORS = ['#FF9800', '#424242'];

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        padding: 2,
        height: '80vh',
        paddingTop: 2,
        paddingBottom: 2,
        px: 0,
        border: 'none',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          color: '#E0E0E0',
          overflow: 'hidden',
        }}
      >
        {/* Left Section: Hash Checker */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflowY: 'hidden',
            height: '100vh',
          }}
        >
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#FF9800' }}>
            Hash Reputation Check
          </Typography>

          <SearchBar onSearch={handleHashSearch} />

          {hashLoading && (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
          )}

          {hashResult && (
            <Card sx={{ mt: 4, backgroundColor: '#2C2C2C', color: '#E0E0E0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>Hash Analysis Result</Typography>
                
                <Typography>
                  <strong>Meaningful Name:</strong> {hashResult.meaningful_name}
                </Typography>
                <Typography>
                  <strong>File Type:</strong> {hashResult.type_tags?.join(', ') || 'Unknown'}
                </Typography>
                <Typography>
                  <strong>File Size:</strong> {hashResult.size} bytes
                </Typography>
                <Typography>
                  <strong>Reputation:</strong> {hashResult.reputation}
                </Typography>
                <Typography>
                  <strong>MD5:</strong> {hashResult.md5}
                </Typography>
                <Typography>
                  <strong>SHA1:</strong> {hashResult.sha1}
                </Typography>

                <Typography variant="subtitle1" sx={{ mt: 2, color: '#FF9800' }}>
                  Last Analysis Stats:
                </Typography>
                {hashResult.last_analysis_stats && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {Object.entries(hashResult.last_analysis_stats).map(([key, value]) => (
                      <Typography key={key} variant="body2">
                        <strong>{key}:</strong> {value}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: '#E0E0E0',
            height: '100vh',
          }}
        />

        {/* Right Section: IP Reputation Checker */}
        <Box
          sx={{
            flex: 1,
            padding: 2,
            overflowY: 'hidden',
            height: '100vh',
          }}
        >
          <Typography variant="h3" component="h1" align="center" sx={{ mb: 4, fontWeight: 'bold', color: '#FF9800' }}>
            IP Reputation Check
          </Typography>

          <SearchBar onSearch={handleIpSearch} />

          {ipLoading && (
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <CircularProgress sx={{ color: '#FF9800' }} />
            </Box>
          )}

          {ipResult && (
            <Card sx={{ mt: 4, backgroundColor: '#2C2C2C', color: '#E0E0E0' }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#FF9800', mb: 2 }}>IP Reputation Result</Typography>
                <Typography>
                  <strong>IP Address:</strong> {ipResult.ip}
                </Typography>
                <Typography>
                  <strong>Blocklist Count:</strong> {ipResult.blocklist_count}
                </Typography>
                <Typography>
                  <strong>Malicious:</strong> {ipResult.is_malicious ? 'Yes' : 'No'}
                </Typography>

                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={preparePieData(ipResult.blocklists)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {preparePieData(ipResult.blocklists).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 2, color: '#FF9800' }}>
                  Blocklists:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {Object.entries(ipResult.blocklists).map(([blocklist, isListed]) => (
                    <Typography key={blocklist} variant="body2">
                      <strong>{blocklist}:</strong> {isListed ? 'Listed' : 'Not Listed'}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default IPnhash;